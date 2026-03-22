//@ts-ignore
'use client';
import React from 'react';
import {
    useForm,
    useFieldArray,
    FormProvider,
    useFormContext,
    FieldError,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '@/shared/components/forms/FormInput';
import FormSelect from '@/shared/components/forms/FormSelect';
import FormSwitch from '@/shared/components/forms/FormSwitch';
import Button from '@/shared/components/Button';
import { useCreateAction, useUpdateAction } from '../hooks';
import { ParameterType } from '../types/parameter';
import { Action } from '../types';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParameterConstraintsForm {
    enum: string;
    min: string;
    max: string;
    minLength: string;
    maxLength: string;
}

interface ParameterFormField {
    name: string;
    type: ParameterType;
    required: boolean;
    description: string;
    defaultValue: string;
    constraints: ParameterConstraintsForm;
    properties: ParameterFormField[];
}

interface ActionFormData {
    name: string;
    description: string;
    version: number;
    required_feature: string;
    parameters: ParameterFormField[];
}

// Zod Schema
const constraintsSchema = z.object({
    enum: z.string(),
    min: z.string(),
    max: z.string(),
    minLength: z.string(),
    maxLength: z.string(),
});

const parameterSchema: z.ZodType<ParameterFormField> = z.lazy(() =>
    z.object({
        name: z.string().min(1, 'Parameter name is required').regex(/^[a-z][a-z0-9_]*$/, 'Must be snake_case'),
        type: z.enum(['string', 'int', 'float', 'boolean', 'object', 'array']),
        required: z.boolean(),
        description: z.string(),
        defaultValue: z.string(),
        constraints: constraintsSchema,
        properties: z.array(parameterSchema),
    })
);

const actionFormSchema = z.object({
    name: z.string().min(1, 'Action name is required').regex(/^[a-z][a-z0-9_]*$/, 'Must be snake_case'),
    description: z.string().min(1, 'Description is required'),
    version: z.number().min(1, 'Version must be at least 1'),
    required_feature: z.string(),
    parameters: z.array(parameterSchema).min(1, 'At least one parameter is required'),
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: { label: string; value: string }[] = [
    { label: 'String', value: 'string' },
    { label: 'Integer', value: 'int' },
    { label: 'Float', value: 'float' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Object', value: 'object' },
    { label: 'Array', value: 'array' },
];

const EMPTY_CONSTRAINTS: ParameterConstraintsForm = {
    enum: '',
    min: '',
    max: '',
    minLength: '',
    maxLength: '',
};

const EMPTY_PARAMETER: ParameterFormField = {
    name: '',
    type: 'string',
    required: false,
    description: '',
    defaultValue: '',
    constraints: { ...EMPTY_CONSTRAINTS },
    properties: [],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildConstraints(c: ParameterConstraintsForm, type: ParameterType): Record<string, any> | undefined {
    const out: Record<string, any> = {};

    if (c.enum.trim()) {
        out.enum = c.enum.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if ((type === 'int' || type === 'float') && c.min.trim()) {
        out.min = parseFloat(c.min);
    }
    if ((type === 'int' || type === 'float') && c.max.trim()) {
        out.max = parseFloat(c.max);
    }

    if (type === 'string' && c.minLength.trim()) {
        out.min_length = parseInt(c.minLength, 10);
    }
    if (type === 'string' && c.maxLength.trim()) {
        out.max_length = parseInt(c.maxLength, 10);
    }

    return Object.keys(out).length > 0 ? out : undefined;
}

function transformParams(params: ParameterFormField[]): Record<string, any> {
    const result: Record<string, any> = {};
    for (const p of params) {
        if (!p.name.trim()) continue;
        const entry: Record<string, any> = { type: p.type, required: p.required };

        if (p.description?.trim()) {
            entry.description = p.description;
        }

        if (p.defaultValue && p.type !== 'object') {
            if (p.type === 'int') entry.default = parseInt(p.defaultValue, 10);
            else if (p.type === 'float') entry.default = parseFloat(p.defaultValue);
            else if (p.type === 'boolean') entry.default = p.defaultValue === 'true';
            else entry.default = p.defaultValue;
        }

        const constraints = buildConstraints(p.constraints, p.type);
        if (constraints) {
            entry.constraints = constraints;
        }

        if (p.type === 'object' && p.properties?.length > 0) {
            entry.properties = transformParams(p.properties);
        }

        result[p.name] = entry;
    }
    return result;
}

function transformParamsToForm(params: Record<string, any>): ParameterFormField[] {
    const result: ParameterFormField[] = [];
    for (const [name, value] of Object.entries(params)) {
        const c = value.constraints;
        const param: ParameterFormField = {
            name,
            type: value.type as ParameterType,
            required: value.required ?? false,
            description: value.description ?? '',
            defaultValue: value.default !== undefined ? String(value.default) : '',
            constraints: {
                enum: c?.enum ? c.enum.join(', ') : '',
                min: c?.min !== undefined ? String(c.min) : '',
                max: c?.max !== undefined ? String(c.max) : '',
                minLength: c?.min_length !== undefined ? String(c.min_length) : '',
                maxLength: c?.max_length !== undefined ? String(c.max_length) : '',
            },
            properties: value.properties ? transformParamsToForm(value.properties) : [],
        };
        result.push(param);
    }
    return result;
}

function getNestedError(errors: Record<string, any>, path: string): FieldError | undefined {
    return path.split('.').reduce((obj, key) => obj?.[key], errors) as FieldError | undefined;
}

function syntaxHighlight(json: string): string {
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        (match) => {
            let cls = 'text-blue-700'; // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-purple-600 font-medium'; // key
                } else {
                    cls = 'text-emerald-700'; // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-rose-600'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-slate-400'; // null
            }
            return `<span class="${cls}">${match}</span>`;
        },
    );
}

// ---------------------------------------------------------------------------
// ParameterList (recursive)
// ---------------------------------------------------------------------------

interface ParameterListProps {
    nestPath: string;
    depth: number;
}

const ParameterList: React.FC<ParameterListProps> = ({ nestPath, depth }) => {
    const {
        control,
        register,
        watch,
        formState: { errors },
    } = useFormContext<ActionFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: nestPath as any,
    });

    return (
        <div className={depth > 0 ? 'pl-5 border-l-2 border-primary/20 ml-1 mt-3 space-y-3' : 'space-y-4'}>
            {depth > 0 && fields.length > 0 && (
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Nested Properties</span>
                </div>
            )}

            {fields.map((field, index) => {
                const basePath = `${nestPath}.${index}`;
                const currentType = watch(`${basePath}.type` as any);
                const currentName = watch(`${basePath}.name` as any) || 'unnamed';
                const nameError = getNestedError(errors as any, `${basePath}.name`);

                return (
                    <div
                        key={field.id}
                        className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 relative shadow-sm"
                    >
                        {/* Header row: live name badge + type badge + delete */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-sm font-bold ${
                                        depth > 0 ? 'text-emerald-600' : 'text-primary'
                                    }`}
                                >
                                    {currentName}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">
                                    {currentType}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>

                        {/* Name + Type row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Name"
                                placeholder="e.g. task_title"
                                register={register(`${basePath}.name` as any, {
                                    required: 'Parameter name is required',
                                    pattern: {
                                        value: /^[a-z][a-z0-9_]*$/,
                                        message: 'Must be snake_case',
                                    },
                                })}
                                error={nameError}
                            />
                            <FormSelect
                                label="Type"
                                name={`${basePath}.type`}
                                control={control}
                                options={TYPE_OPTIONS}
                            />
                        </div>

                        {/* Description */}
                        <FormInput
                            label="Description"
                            placeholder="What this parameter is for..."
                            register={register(`${basePath}.description` as any)}
                        />

                        {/* Required + Default row */}
                        <div className="flex items-center gap-6">
                            <FormSwitch
                                label="Required"
                                name={`${basePath}.required`}
                                control={control}
                            />
                            {currentType !== 'object' && (
                                <div className="flex-1">
                                    <FormInput
                                        label="Default Value"
                                        placeholder="Optional..."
                                        register={register(`${basePath}.defaultValue` as any)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Constraints (contextual by type) */}
                        {currentType !== 'object' && currentType !== 'boolean' && (
                            <details className="group">
                                <summary className="flex items-center gap-2 cursor-pointer select-none py-2 px-3 -mx-3 rounded hover:bg-slate-50 transition-colors">
                                    <span className="material-symbols-outlined text-slate-400 text-sm transition-transform group-open:rotate-90">
                                        chevron_right
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Constraints
                                    </span>
                                </summary>
                                <div className="mt-3 space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    {/* Enum — available for string, int, float, array */}
                                    <FormInput
                                        label="Enum Values"
                                        placeholder="Comma-separated, e.g. low, medium, high"
                                        register={register(`${basePath}.constraints.enum` as any)}
                                        helperText="Restrict to a set of allowed values"
                                    />

                                    {/* Min / Max — for int and float */}
                                    {(currentType === 'int' || currentType === 'float') && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Min"
                                                type="number"
                                                placeholder="No minimum"
                                                register={register(`${basePath}.constraints.min` as any)}
                                            />
                                            <FormInput
                                                label="Max"
                                                type="number"
                                                placeholder="No maximum"
                                                register={register(`${basePath}.constraints.max` as any)}
                                            />
                                        </div>
                                    )}

                                    {/* MinLength / MaxLength — for string */}
                                    {currentType === 'string' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Min Length"
                                                type="number"
                                                placeholder="No minimum"
                                                register={register(`${basePath}.constraints.minLength` as any)}
                                            />
                                            <FormInput
                                                label="Max Length"
                                                type="number"
                                                placeholder="No maximum"
                                                register={register(`${basePath}.constraints.maxLength` as any)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Nested properties for object type */}
                        {currentType === 'object' && (
                            <details className="group" open>
                                <summary className="flex items-center gap-2 cursor-pointer select-none py-2 px-3 -mx-3 rounded hover:bg-slate-50 transition-colors">
                                    <span className="material-symbols-outlined text-slate-400 text-sm transition-transform group-open:rotate-90">
                                        chevron_right
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Object Properties
                                    </span>
                                </summary>
                                <ParameterList
                                    nestPath={`${basePath}.properties`}
                                    depth={depth + 1}
                                />
                            </details>
                        )}
                    </div>
                );
            })}

            <button
                type="button"
                onClick={() =>
                    append({
                        name: '',
                        type: 'string' as ParameterType,
                        required: false,
                        description: '',
                        defaultValue: '',
                        constraints: { ...EMPTY_CONSTRAINTS },
                        properties: [],
                    })
                }
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:border-primary hover:text-primary transition-all text-sm font-bold cursor-pointer"
            >
                <span className="material-symbols-outlined text-base mr-2 align-middle">add</span>
                Add {depth > 0 ? 'Property' : 'Parameter'}
            </button>
        </div>
    );
};

// ---------------------------------------------------------------------------
// JsonPreview
// ---------------------------------------------------------------------------

const JsonPreview: React.FC = () => {
    const { watch } = useFormContext<ActionFormData>();
    const values = watch();

    const payload: Record<string, any> = {
        name: values.name || '',
        description: values.description || '',
        parameters: transformParams(values.parameters || []),
        version: Number(values.version) || 1,
    };
    if (values.required_feature?.trim()) {
        payload.required_feature = values.required_feature;
    }

    const jsonString = JSON.stringify(payload, null, 2);
    const highlighted = syntaxHighlight(jsonString);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonString);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm sticky top-6">
            <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Live JSON Preview
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                        title="Copy to clipboard"
                    >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                </div>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh] font-mono text-sm leading-relaxed text-slate-800">
                <pre dangerouslySetInnerHTML={{ __html: highlighted }} />
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                    <span>Preview updates automatically as you edit fields.</span>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// CreateActionForm (exported)
// ---------------------------------------------------------------------------

interface CreateActionFormProps {
    action?: Action;
}

export const CreateActionForm: React.FC<CreateActionFormProps> = ({ action }) => {
    const { mutateAsync: createAction, isPending: isCreating } = useCreateAction();
    const { mutateAsync: updateAction, isPending: isUpdating } = useUpdateAction(action?.id?.toString() || '');
    const router = useRouter();
    const isEditMode = !!action;
    const isPending = isCreating || isUpdating;

    const methods = useForm<ActionFormData>({
        resolver: zodResolver(actionFormSchema),
        defaultValues: {
            name: action?.name || '',
            description: action?.description || '',
            version: action?.version || 1,
            required_feature: action?.required_feature || '',
            parameters: action?.parameters ? transformParamsToForm(action.parameters) : [],
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = (data: ActionFormData) => {
        const payload = {
            name: data.name,
            description: data.description,
            parameters: transformParams(data.parameters),
            required_feature: data.required_feature || undefined,
            version: Number(data.version),
        };

        const mutation = isEditMode ? updateAction(payload) : createAction(payload);
        mutation.then(() => {
            router.back();
        });
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-6">
                    {/* ---- Left Panel: Form Editor ---- */}
                    <div className="w-3/5 space-y-6">
                        {/* Section 1: Basic Info */}
                        <details
                            className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                            open
                        >
                            <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors select-none">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400 text-sm transition-transform group-open:rotate-90">
                                        chevron_right
                                    </span>
                                    <span className="font-bold text-sm uppercase tracking-wider text-slate-700">
                                        1. Basic Info
                                    </span>
                                </div>
                            </summary>
                            <div className="p-5 border-t border-slate-200 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Action Name"
                                        placeholder="e.g. create_task"
                                        register={register('name', {
                                            required: 'Action name is required',
                                            pattern: {
                                                value: /^[a-z][a-z0-9_]*$/,
                                                message: 'Must be snake_case',
                                            },
                                        })}
                                        error={errors.name}
                                    />
                                    <FormInput
                                        label="Version"
                                        type="number"
                                        placeholder="1"
                                        register={register('version', {
                                            required: 'Version is required',
                                            valueAsNumber: true,
                                            min: { value: 1, message: 'Min version is 1' },
                                        })}
                                        error={errors.version}
                                    />
                                </div>

                                {/* Description (textarea) */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Description
                                        </label>
                                    </div>
                                    <textarea
                                        {...register('description', {
                                            required: 'Description is required',
                                        })}
                                        placeholder="Provide specific instructions for AI context on how and when to use this action..."
                                        rows={3}
                                        className={`
                                            w-full rounded-lg border bg-slate-100 py-2.5 px-4 text-sm text-gray-700 transition-all
                                            focus:bg-slate-200 focus:outline-none placeholder:text-slate-600 resize-none
                                            ${errors.description
                                                ? 'border-red-500/50 focus:border-red-500'
                                                : 'border-slate-200 focus:border-primary/50'
                                            }
                                        `}
                                    />
                                    {errors.description && (
                                        <span className="ml-1 text-[11px] font-medium text-red-400">
                                            {errors.description.message}
                                        </span>
                                    )}
                                </div>

                                <FormInput
                                    label="Required Feature"
                                    placeholder="e.g. tasks"
                                    register={register('required_feature')}
                                    helperText="Optional"
                                />
                            </div>
                        </details>

                        {/* Section 2: Parameters */}
                        <details
                            className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                            open
                        >
                            <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors select-none">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400 text-sm transition-transform group-open:rotate-90">
                                        chevron_right
                                    </span>
                                    <span className="font-bold text-sm uppercase tracking-wider text-slate-700">
                                        2. Parameters
                                    </span>
                                </div>
                            </summary>
                            <div className="p-5 border-t border-slate-200">
                                <ParameterList nestPath="parameters" depth={0} />
                                {errors.parameters && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                        <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                                        <span className="text-sm text-red-600 font-medium">
                                            {errors.parameters.message || 'At least one parameter is required'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </details>

                        {/* Submit Section */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                                    Finalize Action
                                </h3>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    disabled={isPending}
                                >
                                    <span className="material-symbols-outlined text-lg mr-2">
                                        {isEditMode ? 'save' : 'rocket_launch'}
                                    </span>
                                    {isPending 
                                        ? (isEditMode ? 'Updating...' : 'Deploying...') 
                                        : (isEditMode ? 'Update Action' : 'Deploy Action')
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ---- Right Panel: JSON Preview ---- */}
                    <div className="w-2/5">
                        <JsonPreview />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
