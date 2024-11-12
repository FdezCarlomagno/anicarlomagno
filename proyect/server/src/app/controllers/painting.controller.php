<?php

require_once "server/src/app/models/painting.model.php";
require_once "server/src/app/views/JSONview.php";

class Painting_controller {
    private $model;
    private $view;

    public function __construct(){
        $this->model = new Painting_model();
        $this->view = new JSONview();
    }


    public function getPaintings($req, $res){
        $paintings = $this->model->getPaintings();

        if(!$paintings){
            return $this->view->response("no se encontraron cuadros", 404);
        }

        return $this->view->response($paintings, 200);
    }

    public function getPaintingByID($req, $res){
        $id_painting = $req->params->id;

        if(!$id_painting){
            return $this->view->response("cuadro con id=$id_painting no encontrado", 404);
        }

        $painting = $this->model->getPaintingByID($id_painting);

        return $this->view->response($painting, 200);
    }

    public function deletePainting($req, $res){
        $id_painting = $req->params->id;

        if(!$id_painting){
            return $this->view->response("cuadro con id=$id_painting no encontrado", 404);
        }

        try {
            $this->model->deletePainting($id_painting);
        } catch (Exception $e){
            return $this->view->response("No se pudo eliminar el cuadro", 500);
        }

        return $this->view->response("cuadro eliminado con exito", 200);
    }

    public function addPainting($req, $res)
    {

        $body = $_POST;
    
        if (!isset($body["name"], $body["description"], $body["height"], $body["width"], $body["price"])) {
            return $this->view->response("Faltan completar campos", 400);
        }
    
        $uploadDir = 'uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
    
        if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
            $tempName = $_FILES['image']['tmp_name'];
            $fileName = uniqid() . '_' . $_FILES['image']['name'];
            $uploadPath = $uploadDir . $fileName;
    
            if (move_uploaded_file($tempName, $uploadPath)) {
                $image_url = $uploadPath;
            } else {
                error_log("Error moving uploaded file: " . error_get_last()['message']);
                return $this->view->response("Error moving uploaded file", 500);
            }
        } else {
            error_log("No image file uploaded or upload error: " . (isset($_FILES['image']) ? $_FILES['image']['error'] : 'No image in $_FILES'));
            return $this->view->response("No image file uploaded", 400);
        }
    
        $name = $body["name"];
        $description = $body["description"];
        $height = $body["height"];
        $width = $body["width"];
        $price = $body["price"];
        $sold = isset($body["sold"]) ? $body["sold"] : false;
        $discount = isset($body["discount"]) ? $body["discount"] : 0;
    
        $id = $this->model->addPainting($name, $image_url, $price, $description, $sold, $height, $width, $discount);
    
        if ($id) {
            return $this->view->response("Cuadro creado con éxito", 201);
        } else {
            return $this->view->response("Error al crear el cuadro", 500);
        }
    }

    public function updatePaintingField($req, $res) {
        $id = $req->params->id;
        $body = $req->body;
    
        // Verificar que se haya pasado el campo y su valor
        if (!isset($body['field'], $body['value'])) {
            return $this->view->response("Missing mandatory fields", 400);
        }
    
        $field = $body['field'];
        $value = $body['value'];
    
        try {
            // Actualizar el campo específico
            $this->model->updatePaintingField($id, $field, $value);
            return $this->view->response("The field has been updated succesfully", 200);
        } catch (Exception $e) {
            return $this->view->response($e->getMessage(), 400);
        }
    }

    public function updatePainting($req , $res){
        $id = $req->params->id;
        $body = $req->body;
        
        if(!isset($body["name"], $body["description"], $body["image_url"], $body["height"], $body["width"], $body["price"], $body["sold"], $body["discount"])){
            return $this->view->response("Missing mandatory fields", 400);
        }

        $name = $body["name"];
        $description = $body["description"];
        $image_url = $body["image_url"];
        $height = $body["height"];
        $width = $body["width"];
        $price = $body["price"];
        $sold = $body["sold"]; // El cuadro no está vendido por defecto
        $discount = $body["discount"]; // El descuento inicial es 0

        try {
            $this->model->updatePainting($id, $name, $description, $sold, $image_url, $height, $width, $price, $discount);
            return $this->view->response("Fields have been updated succesfully", 200);
        } catch (Exception $e){
            return $this->view->response("error in updating fields");
        }
    }
}