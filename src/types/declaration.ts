import ExamTracker from "../modules/examTracker/examTracker";
import TestItem from "../modules/testItem/testItem";

export declare type TestStatus = 'pending' | 'passed' | 'failed' | 'partial';

export declare type CSSSelector = string; // Alias for clarity, representing a CSS selector

export declare type TestFunction = () => boolean | Promise<TestResultReport>;

export declare type Test = {
    name: string;
    about: string;
    fn: TestFunction;
}

export declare type TestItemConfig = {
    id: string,
    name: string,
    about: string,
    status: TestStatus,
    fn: Test['fn'],
    suite: ExamTracker,
}

export declare type TestDataGroup = {
    name: string;
    tests: TestItem[],
}

export declare type TestResultReport = {
    completed: number;
    total: number;
};