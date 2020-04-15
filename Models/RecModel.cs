namespace SignalRDraw.Models
{
    public class RecModel
    {
        public string type { get; set; }
        public int[] startPos { get; set; }
        public int[] endPos { get; set; }
        public string color { get; set; }
        public int lineWidth { get; set; }
    }
}