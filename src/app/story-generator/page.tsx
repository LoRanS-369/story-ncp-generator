const SelectMulti = ({ label, value, onChange, options }: any) => {
  const safeValue = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select
        value={safeValue.join(',')}
        onValueChange={(v) => {
          const arr = v ? v.split(',').filter(Boolean) : [];
          onChange(arr.length === 1 ? arr[0] : arr);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Sélectionner ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o: string) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
