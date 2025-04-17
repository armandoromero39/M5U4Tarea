var express = require('express');
var router = express.Router();
var novedadesModel = require('./../../models/novedadesModel');

/* GET home page. */
//para listar las novedades
router.get('/', async function(req, res, next) {

  var novedades = await novedadesModel.getNovedades();

  res.render('admin/novedades',{ //login.hbs
    layout:'admin/layout',    //layout.hbs
    persona: req.session.nombre,
    novedades
  });
});

//Para mostrarme el formulario o diseño para agregar novedades
router.get('/agregar', async function(req, res, next) {

    res.render('admin/agregar',{ //agregar.hbs
    layout:'admin/layout',    //layout.hbs
   
  });//cierra render
});//cierra get

/* Para agregar la novedad*/
router.post('/agregar', async (req, res, next) => {
  try {
    if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
      await novedadesModel.insertNovedad(req.body);
      res.redirect('/admin/novedades')

    } else {

      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {

    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargó la novedad'
    })
  }
})

/* Para eliminar la novedad por id */
router.get('/eliminar/:id', async (req, res, next) =>{
  var id = req.params.id;

  console.log(id);

  await novedadesModel.deleteNovedadesById(id);
  res.redirect('/admin/novedades');
}) //cierra get de eliminar

/*Cargar el formulario de modificar con los datos de la novedad */
router.get('/modificar/:id', async (req, res, next)=>{
  var id = req.params.id;

  console.log(id);

  var novedad = await novedadesModel.getNovedadById(id);
  res.render('admin/modificar',{
    layout: 'admin/layout',
    novedad
  })
})

/*Para que actualice la novedad*/
router.post('/modificar', async (req, res, next)=>{
try{
  var obj = {
    titulo: req.body.titulo,
    subtitulo: req.body.subtitulo,
    cuerpo: req.body.cuerpo
  }
  console.log(obj);

  //var id= req.body.id; podría ser así tambien
 // console.log(id);

  await novedadesModel.modificarNovedadById(obj, req.body.id);
  res.redirect('/admin/novedades');

  } catch (error){
    console.log(error);
    res.render('admin/modificar',{
      layout: 'admin/layout',
      error: true,
      message: 'No se modificó la novedad'

    })
  }

})
module.exports = router;