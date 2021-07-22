<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "dublin_bus";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
 die("Connection failed: " . $conn->connect_error);
}
$id = $_GET['q'];
$sql = "select stop_name from dublinbusapplication_stop where stop_name like '%".$id."%' limit 1";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
 while($row = $result->fetch_assoc()) {
 echo $row["stop_name"]. "\n";
 }
} else {
 echo "0 results";
}
$conn->close();
?>