type SectionHeadingProps = {
  muted: string;
  emphasis: string;
};

export function SectionHeading({ muted, emphasis }: SectionHeadingProps) {
  return (
    <h2 className="text-h3 text-foreground">
      <span className="font-normal text-tertiary">{muted}</span>{" "}
      <span className="font-semibold text-foreground">{emphasis}</span>
    </h2>
  );
}
