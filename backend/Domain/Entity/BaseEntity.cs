namespace Domain.Entity
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAlteracao { get; set; }

        protected BaseEntity()
        {
            Id = Guid.NewGuid();
            DataCriacao = DateTime.UtcNow;
        }
        public void AtualizarDataAlteracao()
        {
            DataAlteracao = DateTime.UtcNow;
        }
    }
}
