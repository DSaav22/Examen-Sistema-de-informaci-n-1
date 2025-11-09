<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGrupoRequest extends FormRequest
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
            'nombre_grupo' => 'required|string|max:50',
            'materia_id' => 'required|exists:materias,id',
            'docente_id' => 'required|exists:docentes,id',
            'gestion_academica_id' => 'required|exists:gestiones_academicas,id',
            'cupos_ofrecidos' => 'nullable|integer|min:1|max:200',
            'inscritos' => 'nullable|integer|min:0|max:200',
            'estado' => 'nullable|string|in:Abierto,Cerrado,En Curso,Finalizado',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nombre_grupo.required' => 'El nombre del grupo es obligatorio.',
            'materia_id.required' => 'Debe seleccionar una materia.',
            'materia_id.exists' => 'La materia seleccionada no existe.',
            'docente_id.required' => 'Debe seleccionar un docente.',
            'docente_id.exists' => 'El docente seleccionado no existe.',
            'gestion_academica_id.required' => 'Debe seleccionar una gestión académica.',
            'gestion_academica_id.exists' => 'La gestión académica seleccionada no existe.',
            'cupos_ofrecidos.integer' => 'Los cupos ofrecidos deben ser un número.',
            'cupos_ofrecidos.min' => 'Los cupos ofrecidos deben ser al menos 1.',
            'inscritos.integer' => 'Los inscritos deben ser un número.',
            'inscritos.min' => 'Los inscritos no pueden ser negativos.',
            'estado.in' => 'El estado debe ser: Abierto, Cerrado, En Curso o Finalizado.',
        ];
    }
}
