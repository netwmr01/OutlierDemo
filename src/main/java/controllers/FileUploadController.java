package controllers;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.annotation.MultipartConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;


/**
 * This is an controller to get file from front-end and store it into 
 * @author Hui Zheng
 *
 */
@Controller
public class FileUploadController {
	private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

	@RequestMapping(value="/upload", method=RequestMethod.POST)
	public @ResponseBody String handleFileUpload(@RequestParam("file") MultipartFile file){
		String name = null;
		if (!file.isEmpty()) {
			try {
				name = file.getOriginalFilename();
				byte[] bytes = file.getBytes();
				String rootPath = "src/main/resources/data";
				File dir = new File(rootPath);
				if (!dir.exists())
					dir.mkdirs();
				File serverFile = new File(dir.getAbsolutePath()
						+ File.separator + name);

				/**check the validity of the data fomart
								Pattern p = Pattern.compile ("[0-9]+(,(0("+"\."+"[0-9]+))){2}#[0-9]+(\.[0-9]+){0,1}(,([0-9]+(\.[0-9]+){0,1}))*");

								InputStream inputStream = file.getInputStream();
								InputStreamReader isr = new InputStreamReader (inputStream);
								BufferedReader buf = new BufferedReader (isr);
								String str = null;
								while ((str = buf.readLine ()) != null) 
								{
									//	Matcher m = p.matcher (str);
									if(str.matches("[0-9]+(,(0(\.[0-9]+))){2}#[0-9]+(\.[0-9]+){0,1}(,([0-9]+(\.[0-9]+){0,1}))*")){
										return "The data in file"+name+ "is not valid"; 
									}

								} 
								buf.close();
								isr.close();
								inputStream.close();
				 **/
				

				BufferedOutputStream stream =
						new BufferedOutputStream(new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				logger.info("Server File Location="
						+ serverFile.getAbsolutePath());
				return "You successfully uploaded " + name + "!";
			} catch (Exception e) {
				return "You failed to upload " + name + " => " + e.getMessage();
			}
		} else {
			return "You failed to upload " + name + " because the file was empty.";
		}
	}
	
	
//	@RequestMapping(value="/upload", method=RequestMethod.POST);

}
