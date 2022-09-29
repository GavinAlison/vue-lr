public class Main {

    public static void main(String[] args) {
        Main main = new Main();
        main.oomTest();
    }

    private void oomTest() {
        for (int i = 0; i < 100_000_000_000L; i++) {
            Main main = new Main();
        }
    }
}