import { Router } from 'express';
import { logIn, signIn, deleteUser, getUser, authenticateToken, searchBy, getByLocation, updateLocation, deleteLocation } from './functions.js';

const router = Router();

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    console.log('Body:', req.body);
    res.send(await logIn(req, res));
});

// Ruta para crear un usuario
router.post('/singin', async (req, res) => {
    console.log('Body:', req.body);
    res.send(await signIn(req, res));
});

// Ruta para eliminar un usuario (requiere autenticación)
router.post('/delete', authenticateToken, async (req, res) => {
    console.log('Body:', req.body);
    res.send(await deleteUser(req, res));
});

// Ruta para obtener un usuario (requiere autenticación)
router.post('/getUser', authenticateToken, async (req, res) => {
    console.log('Body:', req.body);
    res.send(await getUser(req, res));
});

router.post('/updateLocation', authenticateToken, async (req, res) => {
    console.log('Body:', req.body);
    res.send(await updateLocation(req, res));
})

router.post('/deleteLocation', authenticateToken, async (req, res) => {
    console.log('Body:', req.body);
    res.send(await deleteLocation(req, res));
})

//Ruta para obtener todos los usuarios filtrados por su ubicación
router.post('/getByLocation', authenticateToken, async (req, res) => {
    console.log('Body:', req.body);
    res.send(await getByLocation(req, res));
});

//Ruta para obtener todos los usuarios filtrados por categorias
router.post('/searchBy', authenticateToken, async (req, res) => {
    console.log('Body:', req.body);
    res.send(await searchBy(req, res));
});


export default router;