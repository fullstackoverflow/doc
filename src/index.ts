import "reflect-metadata";
import { Project, SourceFile, createWrappedNode, ClassDeclaration } from "ts-morph";

export enum Type {
	Response = 0,
	Request
}

const project = new Project({
	tsConfigFilePath: "tsconfig.json"
});

let type: Type;

const TypeSymbol = Symbol("Type");

export const Doc = (Type: Type): ClassDecorator => {
	return target => {
		Reflect.defineMetadata(TypeSymbol, Type, target);
	};
};

const source = project.getSourceFiles().map(source => {
	return source.getClasses().map(classNode => {
		const clazz = require(source.getFilePath())[classNode.getName()];
		if (clazz) {
			const type = Reflect.getMetadata(TypeSymbol, clazz);
			if (type != undefined) {
				return {
					path: source.getFilePath(),
					class: classNode.getName(),
					Type: classNode.isExported() ? Reflect.getMetadata(TypeSymbol, clazz) : "",
					detail: classNode.getProperties().map(p => {
						if (p.getName()) {
							console.log(p.getName(), p.getType().getApparentType().getText());
						}
						return {
							name: p.getName(),
							type: p.getType().getProperties(),
							optional: p.hasQuestionToken(),
							comment: p.getLeadingCommentRanges().map(c =>
								c
									.getText()
									.replace(/\/|\*/g, "")
									.replace(/^\n\t\s+/, "")
									.replace(/\n\t\s+$/, "")
									.replace(" ", "")
									.replace(/\t\s+/, "")
							)
						};
					})
				};
			}
		}
	});
});

console.log(source[1][0]);
