const Logo = () => {
  return (
    <div className="relative flex items-center justify-center h-20 w-20 hover:opacity-90 transition-opacity font-[family-name:var(--font-lora)]">
      <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border-2 border-black" />
      <span className="relative z-10 uppercase px-1 text-black mr-[-0.25rem] ml-[-0.25rem] font-semibold text-base select-none bg-white">
        Jspeeps
      </span>
    </div>
  );
};

export default Logo;
