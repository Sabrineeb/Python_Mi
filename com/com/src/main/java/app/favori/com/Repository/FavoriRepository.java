package app.favori.com.Repository;


import app.favori.com.Entity.Favori;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FavoriRepository extends MongoRepository<Favori, String> {
    List<Favori> findByStudentId(Integer studentId);
}

