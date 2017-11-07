export interface Details {
    categories: {
        discrete?: string[];
        continuous?: string[];
        parameter?: string[];
    };
    desc: {
        modelName: string;
        shortName: string;
        description: string;
    };
    vars: {
        [varname: string]: {
            variability: string;
            valueReference: string;
            description: string;
            units?: string;
            start?: string;
            causality: string;
            name: string;
        }
    };
};
