<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAulaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $aulaId = $this->route('aula');

        return [
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('aulas', 'nombre')->ignore($aulaId),
            ],
            'edificio' => 'required|string|max:100',
            'capacidad' => 'required|integer|min:1|max:500',
            'tipo' => 'required|in:Aula Normal,Laboratorio,Auditorio,Taller',
            'recursos' => 'nullable|string',
            'activo' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del aula es obligatorio.',
            'nombre.unique' => 'Este nombre de aula ya está registrado.',
            'edificio.required' => 'El edificio es obligatorio.',
            'capacidad.required' => 'La capacidad es obligatoria.',
            'capacidad.min' => 'La capacidad debe ser al menos 1.',
            'tipo.required' => 'El tipo de aula es obligatorio.',
        ];
    }
}
