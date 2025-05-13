package app.favori.com.Entity;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "favoris")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Favori {
    @Id
    private String id;
    private Integer studentId;
    private Integer formationId;
    public Favori(Integer studentId, Integer formationId) {
        this.studentId = studentId;
        this.formationId = formationId;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getFormationId() {
        return formationId;
    }

    public void setFormationId(Integer formationId) {
        this.formationId = formationId;
    }
// Getters et setters
}
