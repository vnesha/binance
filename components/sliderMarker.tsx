type MarkerProps = {
  value: number;
  onClick: () => void;
};

const Marker: React.FC<MarkerProps> = ({ value, onClick }) => (
  <div>
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="z-[1] h-2 w-2 cursor-pointer rounded-full bg-[#ddd]"
    />
    <div className="mt-2">{value}x</div>
  </div>
);

export default Marker;
