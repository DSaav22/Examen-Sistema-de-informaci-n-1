<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\User;
use App\Http\Requests\StoreDocenteRequest;
use App\Http\Requests\UpdateDocenteRequest;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $docentes = Docente::with('usuario.role')
            ->orderBy('codigo_docente')
            ->paginate(10);

        return Inertia::render('Docentes/Index', [
            'docentes' => $docentes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Obtener usuarios con rol 'docente' que no estén ya registrados como docentes
        $usuariosDisponibles = User::with('role')
            ->whereHas('role', function ($query) {
                $query->where('nombre', 'docente');
            })
            ->whereDoesntHave('docente')
            ->where('activo', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Docentes/Create', [
            'usuarios' => $usuariosDisponibles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocenteRequest $request): RedirectResponse
    {
        Docente::create($request->validated());

        return redirect()->route('docentes.index')
            ->with('success', 'Docente registrado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Docente $docente)
    {
        $docente->load([
            'usuario.role',
            'grupos.materia',
            'grupos.gestionAcademica',
        ]);

        return Inertia::render('Docentes/Show', [
            'docente' => $docente,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Docente $docente)
    {
        $docente->load('usuario.role');

        // Obtener usuarios disponibles (incluyendo el actual)
        $usuariosDisponibles = User::with('role')
            ->whereHas('role', function ($query) {
                $query->where('nombre', 'docente');
            })
            ->where(function ($query) use ($docente) {
                $query->whereDoesntHave('docente')
                    ->orWhere('id', $docente->usuario_id);
            })
            ->where('activo', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Docentes/Edit', [
            'docente' => $docente,
            'usuarios' => $usuariosDisponibles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocenteRequest $request, Docente $docente): RedirectResponse
    {
        $docente->update($request->validated());

        return redirect()->route('docentes.index')
            ->with('success', 'Docente actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Docente $docente): RedirectResponse
    {
        try {
            $docente->delete();
            return redirect()->route('docentes.index')
                ->with('success', 'Docente eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->route('docentes.index')
                ->with('error', 'No se puede eliminar el docente porque tiene grupos asignados.');
        }
    }
}
