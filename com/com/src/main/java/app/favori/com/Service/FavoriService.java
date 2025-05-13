package app.favori.com.Service;

import app.favori.com.Entity.Favori;
import app.favori.com.Repository.FavoriRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriService {

    @Autowired
    private FavoriRepository favoriRepository;

    @Cacheable(value = "favoris", key = "#studentId")
    public List<Favori> getFavorisByStudentId(Integer studentId) {
        return favoriRepository.findByStudentId(studentId);
    }

    public Favori saveFavori(Favori favori) {
        return favoriRepository.save(favori);
    }

    public void deleteFavori(String id) {
        favoriRepository.deleteById(id);
    }
}
