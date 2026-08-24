// Arquivo: Informacao.java
public class Informacao {
    private String nome;

    public Informacao(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return this.nome;
    }

    @Override
    public String toString() {
        return "[" + this.nome + "]";
    }
}