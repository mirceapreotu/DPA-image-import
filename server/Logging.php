<?php 

class Logging{
	private $log_file = 'dpa.log';
	private $fp = null;
	
	public function lwrite($message){
		if (!$this->fp) {
			$this->lopen();
		}
		
  	$script_name = pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME);
  	$time = date('H:i:s');
		
		// write current time, script name and message to the log file
		fwrite($this->fp, "$time ($script_name) $message\n");
	}
	
	private function lopen(){
		$this->fp = fopen($this->log_file, 'a') or exit("Can't open $this->log_file!");
	}
}