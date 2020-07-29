INSERT INTO public.persona(
	nombre_persona, direccion_persona, numero_persona, ci_persona, tipo_persona)
	VALUES ($1, $2, $3, $4, 'cliente') RETURNING id_persona;