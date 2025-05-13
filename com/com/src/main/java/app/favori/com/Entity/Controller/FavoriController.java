package app.favori.com.Entity.Controller;

import app.favori.com.Entity.Favori;
import app.favori.com.Repository.FavoriRepository;
import app.favori.com.Service.FastApiService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoris")
public class FavoriController {

    @Autowired
    private FavoriRepository favoriRepository;

    @Autowired
    private FastApiService fastApiService;

    @PostMapping
    public ResponseEntity<?> addFavori(@RequestBody Favori favori) {
        try {
            System.out.println("Requête reçue : " + favori);

            // Vérification si l'étudiant existe
            Object etudiant = fastApiService.getStudentById(favori.getStudentId());

            if (etudiant == null) {
                return ResponseEntity
                        .badRequest()
                        .body("Étudiant avec ID " + favori.getStudentId() + " introuvable.");
            }

            Favori saved = favoriRepository.save(favori);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.out.println("Erreur lors de l'ajout du favori : " + e.getMessage());
            return ResponseEntity
                    .internalServerError()
                    .body("Erreur serveur : " + e.getMessage());
        }
    }

    @GetMapping("/{studentId}")
    public List<Favori> getFavoris(@PathVariable Integer studentId) {
        return favoriRepository.findByStudentId(studentId);
    }

    @DeleteMapping("/{id}")
    public void deleteFavori(@PathVariable String id) {
        favoriRepository.deleteById(id);
    }

}
