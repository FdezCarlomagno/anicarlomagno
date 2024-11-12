<?php

class Painting_model {
    private $db;

    public function __construct(){
        $this->db = $this->getConnection();
    }

    private function getConnection(){
        return new PDO('mysql:host=localhost;dbname=anicarlomagno;charset=utf8', 'root', '');
    }

    public function getPaintings(){
        $query = $this->db->prepare("SELECT * FROM paintings");
        $query->execute();

        return $query->fetchAll(PDO::FETCH_OBJ);
    }

    public function getPaintingByID($id_painting){
        $query = $this->db->prepare("SELECT * FROM paintings WHERE id = ?");
        $query->execute([$id_painting]);

        return $query->fetch(PDO::FETCH_OBJ);
    }

    public function addPainting($name, $image_url, $price, $description, $sold, $height, $width, $discount){
        $query = $this->db->prepare("INSERT INTO paintings(name, image_url, price, description, sold, height, width, discount) VALUES(?,?,?,?,?,?,?,?)");
        $query->execute([$name, $image_url, $price, $description, $sold, $height, $width, $discount]);

        return $this->db->lastInsertId();
    }

    public function deletePainting($id){
        $query = $this->db->prepare("DELETE * FROM paintings WHERE id = ?");
        $query->execute([$id]);
    }

    public function updatePaintingField($id, $field, $value) {
        // Validar el campo
        $allowedFields = ['name', 'description', 'sold', 'image_url', 'height', 'width', 'price', 'discount'];
        if (!in_array($field, $allowedFields)) {
            throw new Exception("Campo no permitido para actualización.");
        }
    
        // Preparar la consulta
        $query = $this->db->prepare("UPDATE paintings SET $field = ? WHERE id = ?");
        $query->execute([$value, $id]);
    }

    public function updatePainting($id, $name, $description, $sold, $image_url, $height, $width, $price, $discount) {
        $query = $this->db->prepare("UPDATE paintings SET name = ?, description = ?, sold = ?, image_url = ?, height = ?, width = ?, price = ?, discount = ? WHERE id = ?");
        
        $query->execute([$name, $description, $sold, $image_url, $height, $width, $price, $discount, $id]);
        
        // Retornar la cantidad de filas afectadas (por si se quiere verificar que algo cambió)
        return $query->rowCount();
    }


    
}