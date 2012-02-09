<?php
/**
* @desc DPA image upload server side
*/
require_once("Logging.php");

$error_message[0] = "Unknown problem with upload.";
$error_message[1] = "Uploaded file too large.";
$error_message[2] = "Uploaded file too large.";
$error_message[3] = "File was only partially uploaded.";
$error_message[4] = "Choose a file to upload.";

function dumpData() 
{
	$log = new Logging();
	$log->lwrite("call");
	$log->lwrite(var_export($_POST, true));
	$log->lwrite(var_export($_FILES, true));
	var_dump($_POST);
	var_dump($_FILES);
}

function findUnusedName($path, $filename, $i) 
{
	if ($i > 0) {
		$newfile = substr($filename, 0, strrpos($filename, '.')) . $i . strrchr($filename, '.');
	} else {
		$newfile=$filename;
	}

	if (file_exists($path.$newfile)) {
		return findUnusedName($path, $filename, $i+1);
	}                     

	return $path . $newfile;
}

function decode($tmpname, $filename) 
{
	$tmpFile = fopen($tmpname, 'r');
	$file = fopen($filename, 'w');
	while (!feof($tmpFile)) {
		fwrite($file, base64_decode(fread($tmpFile, 8192)));
	}
	fclose($file);
	fclose($tmpFile);
}

function savePicture() 
{
	// count number of files to upload
	$num_files = count($_FILES);
	$ids = array_keys($_FILES);
	$index=0;
	$log = new Logging();
	$maxSize = 2; // MB

	// no file to upload
	if ($num_files == 0) {
		$log->lwrite("no file to upload");
		return "no file to upload";
	}

	// start upload process
	foreach ($_FILES as $arrfile) {
		if ($arrfile['size']>($maxSize*1048576)) {
			$log->lwrite("error #1: max size exceeded");
			return "Sorry, maximum ".$maxSize."MB!";
		}

		$filename = $arrfile['name'];
		$log->lwrite("uploading $filename...");
		$tmpname = $arrfile['tmp_name'];
		$error=$arrfile['error'];  

		// find an unused name
		$upload_file = findUnusedName(dirname(__FILE__) . "/dpa/", $filename, 0);

		// if not a picture: exit!
		if (!preg_match("/(gif|jpg|jpeg|png)$/i",$filename)) {
			$log->lwrite("error #2: Failed: the file is not an image");
			return "Failed: the file is not an image";
		} else {   
			// move the file
			if (is_uploaded_file($tmpname)) {
				decode($tmpname, $upload_file);
				$log->lwrite("success");
				return "/path/to/uploaded/$filename";
			}
			
			$log->lwrite("error: ".$_FILES['user_file']['error'][$i]);
			return $error_message[$_FILES['user_file']['error'][$i]];
		}
	}

	// send response
	$log->lwrite("upload script ended");
	return "/path/to/uploaded/$filename";
}

echo savePicture();
//echo dumpData();