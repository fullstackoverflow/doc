import "reflect-metadata";
import { Doc } from "../../src/index";
import { Type } from "../../src/index";

@Doc(Type.Request)
export class Test {
	/**
	 * 这是一个xxxx字段
	 *   yyyy  zzzzz
	 */
	yyy: string[];

	aaa: Test2;
}

class Test2 {
	zzz: boolean;
}
