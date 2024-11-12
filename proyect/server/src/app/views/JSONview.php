<?php
class JSONview {
    public function response($data, $status = 200){
        $statusText = $this->getStatusText($status);
        header("Content-Type: application/json");
        header("HTTP/1.1 $status, $statusText");
        echo json_encode($data);

    }

    public function getStatusText($code){
        $status = [
            200 => "OK",
            201 => "Created",
            204 => "No Content",
            400 => "Bad Request",
            404 => "Not Found",
            500 => "Internal Server Error"
        ];
        if(!isset($status[$code])){
            $code = 500;
        }
        return $status[$code];
    }
}