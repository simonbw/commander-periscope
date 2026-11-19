import GridSectors from "../../grid/GridSectors";
import GridSectorSelect from "../../grid/GridSectorSelect";

interface DroneModeProps {
  useDrone: (sector: number) => void;
  waitingForResponse: boolean;
}

const DronePicker = (props: DroneModeProps) => (
  <GridSectorSelect
    onSelect={(sector) => {
      if (sector != null) {
        props.useDrone(sector);
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(sector) => <GridSectors selected={sector} />}
  </GridSectorSelect>
);

export default DronePicker;
