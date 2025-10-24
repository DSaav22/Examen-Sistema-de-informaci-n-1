<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMateriaRequest extends FormRequest
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
        $materiaId = $this->route('materia');

        return [
            'nombre' => 'required|string|max:150',
            'codigo' => [
                'required',
                'string',
                'max:20',
                Rule::unique('materias', 'codigo')->ignore($materiaId),
            ],
            'carrera_id' => 'required|exists:carreras,id',
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
            'nombre.required' => 'El nombre de la materia es obligatorio.',
            'codigo.required' => 'El código de la materia es obligatorio.',
            'codigo.unique' => 'Este código ya está registrado.',
            'carrera_id.required' => 'Debe seleccionar una carrera.',
            'carrera_id.exists' => 'La carrera seleccionada no existe.',
            'nivel.required' => 'El nivel o semestre es obligatorio.',
            'creditos.required' => 'Los créditos son obligatorios.',
            'horas_semanales.required' => 'Las horas semanales son obligatorias.',
        ];
    }
}
