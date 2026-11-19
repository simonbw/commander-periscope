import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Button, Collapse, MobileStepper, Paper } from "@mui/material";
import { useState } from "react";
import styles from "../../../styles/MainMenu.module.css";
import steps from "./HowToPlaySteps";

/** step -1: not started yet, -2: finished, otherwise the step being shown. */
function getStepContent(step: number) {
  if (step === -2) {
    return steps[steps.length - 1];
  } else if (step === -1) {
    return steps[0];
  } else {
    return steps[Math.max(step, 0)];
  }
}

const HowToPlay = () => {
  const [step, setStep] = useState(-1);

  const nextStep = () => setStep(step === steps.length - 1 ? -2 : step + 1);
  const previousStep = () => setStep(step - 1);

  return (
    <Paper className={styles.HowToPlay}>
      <Collapse in={step < 0} timeout="auto">
        <Button disabled={step >= 0} fullWidth name="How To Play Button" onClick={() => setStep(0)}>
          How To Play
        </Button>
      </Collapse>
      <Collapse in={step >= 0} timeout="auto">
        {getStepContent(step)}
        <MobileStepper
          activeStep={step}
          className={styles.Stepper}
          position="static"
          steps={steps.length}
          variant="dots"
          backButton={
            <Button name="Instructions Back Button" onClick={previousStep} size="small">
              <KeyboardArrowLeft />
              Back
            </Button>
          }
          nextButton={
            <Button name="Instructions Next Button" onClick={nextStep} size="small">
              {step === steps.length - 1 ? "Done" : "Next"}
              <KeyboardArrowRight />
            </Button>
          }
        />
      </Collapse>
    </Paper>
  );
};

export default HowToPlay;
