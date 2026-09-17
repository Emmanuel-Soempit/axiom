export type ParameterType = 'string' | 'int' | 'float' | 'boolean' | 'object' | 'array';

export interface ParameterNode {
    id: string;
    name: string;
    type: ParameterType;
    required: boolean;
    children: ParameterNode[];
}
