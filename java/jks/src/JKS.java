import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;

import javax.crypto.*;


public class JKS extends HttpServlet {
	
	private static final long serialVersionUID = 2561912953742791525L;

	// keyStore full https URL to keystore file.
	public static final String KEYREMOTE = "";
	public static final String KEYPATH = "WEB-INF" + File.separatorChar;
	public static final String KEYFILE = "yapp";
	public static final String KEYNAME = "yapp"; // ALIAS
	public static final String KEYPASS = "password";
	public static final String KEYEXT  = ".jks";
	public static final String KEYINST = "RSA";

	private String keyPath;

	private KeyStore       keyStore;
	private PrivateKey     keyPrivate;
	private PublicKey      keyPublic;
	private KeyPair        keyPair;
	private Cipher         keyCipher;
	private ServletContext servletContext;
	
	
	// Constructor (use init instead)
    public JKS() {
        super();
    }

    // When Servlet loads. (?)
    public void init(ServletConfig config) throws ServletException {  
    	super.init(config);
    	this.servletContext = getServletContext();
    	// Full path for keystore directory
    	this.keyPath = this.servletContext.getRealPath("/") + KEYPATH;
    	// Load KeyStore
    	this.keyStore  = this.getKeys(); 
    }     
  
    private KeyStore getKeys(){
    	String       path = this.keyPath + KEYFILE + KEYEXT;
    	KeyStore keystore = null;
    	try {
    		// KEYSTORE
        	File file = new File(path);
			FileInputStream fileInputStream = new FileInputStream(file);
				keystore = KeyStore.getInstance(KeyStore.getDefaultType());
				keystore.load(fileInputStream, KEYPASS.toCharArray());
			fileInputStream.close();
			// PRIVATE
			this.keyPrivate = (PrivateKey)keystore.getKey(KEYNAME, KEYPASS.toCharArray());
			// PUBLIC
			Certificate cert = keystore.getCertificate(KEYNAME);
			this.keyPublic = cert.getPublicKey();
			// KEYPAIR
			this.keyPair = new KeyPair(this.keyPublic, this.keyPrivate);
			// CIPHER
			this.keyCipher = Cipher.getInstance(KEYINST);
		} catch (FileNotFoundException e) {
			System.out.println("El Keystore no fue encontrado; (" + path + ")");
		} catch (KeyStoreException e) {
			System.out.println("No se pudo accesar al Keystore; " + e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			System.out.println("Algoritmo inválido; " + e.getMessage());
		} catch (CertificateException e) {
			System.out.println("Error en el certificado; " + e.getMessage());
		} catch (IOException e) {
			System.out.println("Error en el Keystore; " + e.getMessage());
		} catch (UnrecoverableKeyException e) {
			System.out.println("Error accesando a llave; " + e.getMessage());
		} catch (NoSuchPaddingException e) {
			System.out.println("Error en Cipher; " + e.getMessage());
		}
    	return keystore;
    }

    private String decrypt(byte[] bytes){
 	   String str = null;
 	   try {
 		   this.keyCipher.init(Cipher.DECRYPT_MODE, this.keyPrivate);
 		   str = new String(this.keyCipher.doFinal(bytes));
 	   } catch (InvalidKeyException e) {
 		   System.out.println("Error InvalidKey : " + e.getMessage());
 	   } catch (IllegalBlockSizeException e) {
 		   System.out.println("Error Cipher BlockSize  : " + e.getMessage());
 	   } catch (BadPaddingException e) {
 		   System.out.println("Error Cipher Padding : " + e.getMessage());
 	   }
 	   return str;
    }
    
    private byte[] encrypt(String str){
    	byte[] bytes = null;
    	try {
			this.keyCipher.init(Cipher.ENCRYPT_MODE, this.keyPublic);
			bytes = this.keyCipher.doFinal(str.getBytes());
		} catch (InvalidKeyException e) {
			System.out.println("Error de encriptación, llave inválida; " + e.getMessage());
		} catch (IllegalBlockSizeException e) {
			System.out.println("Error de encriptación, Tamño de bloque; " + e.getMessage());
		} catch (BadPaddingException e) {
			System.out.println("Error de encriptación, Padding; " + e.getMessage());
		}
    	return bytes;
    }

    // GET
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
    
        String test = "Hola Mundo!";
        
        out.println("Original      : " + test);
        
        byte[] crypt = this.encrypt(test);
        out.println("Encriptada    : " + crypt.toString());
        
        out.println("Desencriptada : " + this.decrypt(crypt));
    }
}
