import { Button, Collapse, Paper } from 'material-ui';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'material-ui-icons';
import MobileStepper from 'material-ui/MobileStepper';
import React, { Component } from 'react';
import styles from '../../../../styles/MainMenu.css'
import steps from './HowToPlaySteps'

class HowToPlay extends Component {
  static propTypes = {};
  
  constructor(props) {
    super(props);
    this.state = {
      step: -1,
    }
  }
  
  nextStep() {
    if (this.state.step === steps.length - 1) {
      this.setState({ step: -2 });
    } else {
      this.setState({ step: this.state.step + 1 });
    }
  }
  
  previousStep() {
    this.setState({ step: this.state.step - 1 });
  }
  
  render() {
    const step = this.state.step;
    return (
      <Paper className={styles.HowToPlay}>
        <Collapse in={step < 0}>
          <Button fullWidth onClick={() => this.setState({ step: 0 })}>
            How To Play
          </Button>
        </Collapse>
        <Collapse in={step >= 0}>
          {this.renderStep()}
          <MobileStepper
            className={styles.Stepper}
            variant="dots" steps={steps.length}
            position="static"
            activeStep={step}
            nextButton={
              <Button
                size="small"
                onClick={() => this.nextStep()}
              >
                {step === steps.length - 1 ? 'Done' : 'Next'}
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={() => this.previousStep()}
              >
                <KeyboardArrowLeft/>
                Back
              </Button>
            }
          />
        </Collapse>
      </Paper>
    );
  }
  
  renderStep() {
    const step = this.state.step;
    if (step === -2) {
      return steps[steps.length - 1];
    } else if (step === -1) {
      return steps[0];
    } else {
      return steps[Math.max(step, 0)];
    }
  }
}

HowToPlay.propTypes = {};

export default HowToPlay;