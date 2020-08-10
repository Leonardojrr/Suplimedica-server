INSERT INTO public.usuario(
	nombre_usuario, contrasena_usuario, id_persona)
	VALUES ($1, $2, $3) RETURNING id_usuario;