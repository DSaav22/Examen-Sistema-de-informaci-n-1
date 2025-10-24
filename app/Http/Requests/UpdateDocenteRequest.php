<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocenteRequest extends FormRequest
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
        $docenteId = $this->route('docente');

        return [
            'usuario_id' => [
                'required',
                'exists:users,id',
                Rule::unique('docentes', 'usuario_id')->ignore($docenteId),
            ],
            'codigo_docente' => [
                'required',
                'string',
                'max:20',
                Rule::unique('docentes', 'codigo_docente')->ignore($docenteId),
            ],
            'especialidad' => 'nullable|string|max:100',
            'grado_academico' => 'required|in:Licenciatura,Maestría,Doctorado',
            'fecha_contratacion' => 'nullable|date',
            'tipo_contrato' => 'required|in:Tiempo Completo,Medio Tiempo,Por Horas',
            'activo' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'usuario_id.required' => 'Debe seleccionar un usuario.',
            'usuario_id.exists' => 'El usuario seleccionado no existe.',
            'usuario_id.unique' => 'Este usuario ya está registrado como docente.',
            'codigo_docente.required' => 'El código del docente es obligatorio.',
            'codigo_docente.unique' => 'Este código ya está registrado.',
            'grado_academico.required' => 'El grado académico es obligatorio.',
            'tipo_contrato.required' => 'El tipo de contrato es obligatorio.',
        ];
    }
}
