<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMateriaRequest extends FormRequest
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
        return [
            'sigla' => 'required|string|max:20|unique:materias,sigla',
            'nombre' => 'required|string|max:150',
            'carreras' => 'nullable|array',
            'carreras.*.carrera_id' => 'required|exists:carreras,id',
            'carreras.*.semestre_sugerido' => 'nullable|integer|min:1|max:12',
            'carreras.*.obligatoria' => 'nullable|boolean',
            'nivel' => 'required|integer|min:1|max:12',
            'creditos' => 'required|integer|min:1|max:10',
            'horas_semanales' => 'required|integer|min:1|max:20',
            'descripcion' => 'nullable|string',
            'activo' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'sigla.required' => 'La sigla de la materia es obligatoria.',
            'sigla.unique' => 'Esta sigla ya está registrada.',
            'nombre.required' => 'El nombre de la materia es obligatorio.',
            'carreras.array' => 'Las carreras deben ser un arreglo.',
            'carreras.*.carrera_id.required' => 'Debe seleccionar una carrera.',
            'carreras.*.carrera_id.exists' => 'La carrera seleccionada no existe.',
            'carreras.*.semestre_sugerido.integer' => 'El semestre debe ser un número entero.',
            'nivel.required' => 'El nivel o semestre es obligatorio.',
            'creditos.required' => 'Los créditos son obligatorios.',
            'horas_semanales.required' => 'Las horas semanales son obligatorias.',
        ];
    }
}
