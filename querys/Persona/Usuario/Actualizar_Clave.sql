UPDATE public.usuario SET nombre_usuario=$2, contrasena_usuario=$3 WHERE id_persona=$1 RETURNING id_usuario;