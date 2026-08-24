public class No {
    public Informacao info;
    public No elop; // Elo Próximo
    public No eloa; // Elo Anterior

    public No(Informacao info) {
        this.info = info;
        this.elop = null;
        this.eloa = null;
    }
}