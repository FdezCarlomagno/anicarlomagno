<?php

require_once "server/libs/router.php";
require_once "app/controllers/painting.controller.php";

$router = new Router();


                    //URL      //Verb   //controller         //function called in the controller           
$router->addRoute("paintings", "GET", "Painting_controller", "getPaintings");
$router->addRoute("paintings/painting/:id", "GET", "Painting_controller", "getPainting");
$router->addRoute("paintings", "POST" , "Painting_controller", "addPainting");
$router->addRoute("paintings/painting/:id", "DELETE" , "Painting_controller", "deletePainting");
$router->addRoute("paintings/painting/:id", "PATCH", "Painting_controller", "updatePaintingField");
$router->addRoute("paintings/painting/:id", "PUT", "Painting_controller", "updatePainting");
                    
                    
$router->route($_GET['resource'], $_SERVER['REQUEST_METHOD']);