package app.favori.com.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class FastApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Object getStudentById(int studentId) {
        String url = "http://localhost:9001/students/" + studentId;

        try {
            return restTemplate.getForObject(url, Object.class);
        } catch (HttpClientErrorException.NotFound e) {
            System.out.println("Étudiant non trouvé dans FastAPI : " + studentId);
            return null;
        } catch (Exception e) {
            System.out.println("Erreur lors de l'appel à FastAPI : " + e.getMessage());
            return null;
        }
    }
}
