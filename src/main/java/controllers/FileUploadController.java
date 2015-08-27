package controllers;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileOutputStream;
import java.util.LinkedHashSet;

import org.apache.commons.io.FilenameUtils;
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
	String rootPath = "src/main/resources/data";
	
	@RequestMapping(value="/upload", method=RequestMethod.POST)
	public @ResponseBody String handleFileUpload(@RequestParam("file") MultipartFile file){
		String name = null;
		if (!file.isEmpty()) {
			try {
				
				name = file.getOriginalFilename();
				String foldername = FilenameUtils.removeExtension(name);
				byte[] bytes = file.getBytes();
				
				File dir = new File(rootPath);
				if (!dir.exists())
					dir.mkdirs();
				File serverFilePath = new File(dir.getAbsolutePath()
						+ File.separator + foldername);
				if (!serverFilePath.exists())
					serverFilePath.mkdirs();
				File serverFile = new File(dir.getAbsolutePath()
						+ File.separator + foldername+File.separator+ name);

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
	
	
	@RequestMapping(value="/getExistingFileList")
	public @ResponseBody LinkedHashSet<String> getExistingFileList(){
		LinkedHashSet<String> fileSet = new LinkedHashSet<String>();
		File directory = new File(rootPath);
		File[] fList = directory.listFiles();
		for(final File f: fList){
			if(f.isDirectory()){
				FileFilter filter =new FileFilter(){
					public boolean accept(File file){
							return file.getName().startsWith(f.getName());							
					}
				};
				File[] result = f.listFiles(filter);
				if(result.length!=0){
					fileSet.add(result[0].getName());
				}
			}
		}
		
		return fileSet;
	}
	
	


}
