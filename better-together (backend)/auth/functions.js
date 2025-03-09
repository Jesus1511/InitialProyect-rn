import { User } from './model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'your-secret-key';

export function authenticateToken(req, res, next) {
    console.log(req.body)
    const token = req.body.token
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        try {
            const user = await User.findById(decodedUser.id);  // Usando el `id` del token

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            req.user = user; // Agregar el usuario completo a `req.user`
            next(); // Pasar al siguiente middleware o ruta
            
        } catch (error) {
            return res.status(500).json({ message: 'Error al buscar el usuario en la base de datos' });
        }
    });
}

export async function logIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Credenciales incorrectas' });
            return 
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);

        res.status(200).json({ message: 'Inicio de sesión exitoso', token, user });
    } catch (error) {
        console.error(error)
        res.status(500).send('Error al iniciar sesión');
    }
}

export async function signIn(req, res) {
    
    const { name, email, password, preferences, lenguages, ages } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'El usuario ya existe' });
            return 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            preferences,
            ages,
            lenguages,
            image: null,
        });
        await user.save();

        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
}

export async function deleteUser(req, res) {
    const { id } = req.body;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return 
        }


        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al eliminar el usuario'});
    }
}

export async function getUser(req, res) {
    const { id } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return 
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener el usuario'});
    }
}

export async function updateLocation(req, res) {
    try {
        const { longitude, latitude, city, state, country } = req.body
        const ubication = {longitude, latitude, city, state, country}
        const user = req.user

        user.ubication = ubication
        await user.save()
        
        res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
}

export async function deleteLocation(req, res) {
    try {
        const user = req.user

        user.ubication = null
        await user.save()
        
        res.status(200).json({ message: 'Ubicación elimnada exitosamente', user });
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
}

// Función pura: lógica principal de `getByLocation`
async function getUsersByLocation(zone, zoneFilterLevel) {
    try {
        const nearUsers = await User.find({ [`ubication.${zoneFilterLevel}`]: zone });
        return nearUsers; // Devuelve los usuarios encontrados
    } catch (error) {
        throw new Error('Error al obtener usuarios por ubicación: ' + error.message);
    }
}

// Controlador de Express: Maneja la solicitud HTTP para `getByLocation`
export async function getByLocation(req, res) {
    const { zone, zoneFilterLevel } = req.body;

    try {
        const nearUsers = await getUsersByLocation(zone, zoneFilterLevel);

        if (!nearUsers || nearUsers.length === 0) {
            res.status(404).json({ message: 'Usuarios no encontrados' });
            return 
        }

        res.status(200).json({ users: nearUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
}

// Controlador de Express: `searchBy` llama a `getUsersByLocation` directamente
export async function searchBy(req, res) {
    const { category, value, zone, zoneFilterLevel } = req.body;

    if (!category || !value || !zone || !zoneFilterLevel ) {
        res.status(400).json({ message: 'Parámetros insuficientes en la solicitud' });
        return 
    }

    try {
        // Llamar a la función pura
        const nearUsers = await getUsersByLocation(zone, zoneFilterLevel);

        console.log(nearUsers);

        if (!nearUsers || nearUsers.length === 0) {
            res.status(404).json({ message: 'Usuarios no encontrados' });
            return 
        }

        const filteredUsers = nearUsers.filter(user => {
            const field = user[category];
            return field && field.includes(value);
        });

        if (filteredUsers.length === 0) {
            res.status(404).json({ message: 'Usuarios no encontrados' });
            return 
        }

        res.status(200).json({ users: filteredUsers });
    } catch (error) {
        console.error('Error en searchBy:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
}
