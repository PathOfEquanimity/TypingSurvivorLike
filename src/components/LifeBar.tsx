export default function LifeBar({
  life,
  maxLife,
}: {
  life: number;
  maxLife: number;
}) {
  const lifePercentage = (life / maxLife) * 100;
  return (
    <div className="life-bar-container">
      <div className="life-bar" style={{ width: `${lifePercentage}%` }}>
        {life} / {maxLife}
      </div>
    </div>
  );
}
