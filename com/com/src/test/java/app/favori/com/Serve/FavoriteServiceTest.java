package app.favori.com.Serve;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import app.favori.com.Entity.Favori;
import app.favori.com.Repository.FavoriRepository;
import app.favori.com.Service.FavoriService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;

public class FavoriteServiceTest {

    @Mock
    private FavoriRepository favoriRepository; // Mock du repository

    @InjectMocks
    private FavoriService favoriService; // Injection des mocks dans le service

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialisation des mocks
    }

    @Test
    void testAddFavori() {
        // Arrange
        Integer studentId = 1;  // Utilisation de Integer
        Integer formationId = 101;  // Utilisation de Integer
        Favori favori = new Favori(studentId, formationId); // Utilisation du constructeur qui prend Integer

        when(favoriRepository.save(any(Favori.class))).thenReturn(favori);

        // Act
        Favori result = favoriService.saveFavori(favori);

        // Assert
        assertNotNull(result);
        assertEquals(studentId, result.getStudentId());
        assertEquals(formationId, result.getFormationId());
    }

    @Test
    void testGetFavoris() {
        // Arrange
        Integer studentId = 1;  // Utiliser Integer, pas int
        // Création de Favori avec les bons types
        List<Favori> favoris = List.of(new Favori(studentId, 101), new Favori(studentId, 102));
        when(favoriRepository.findByStudentId(studentId)).thenReturn(favoris);

        // Act
        List<Favori> result = favoriService.getFavorisByStudentId(studentId); // Appel de la méthode de service

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
    }
}
