SELECT id_usuario,persona.id_persona,nombre_persona,nombre_usuario,ci_persona,direccion_persona,numero_persona FROM public.persona 
INNER JOIN public.usuario ON persona.id_persona=usuario.id_persona
WHERE tipo_persona='empleado';