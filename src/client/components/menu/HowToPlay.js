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
        <Collapse in={step < 0} timeout={'auto'}>
          <Button
            disabled={step >= 0}
            fullWidth
            name="How To Play Button"
            onClick={() => this.setState({ step: 0 })}
          >
            How To Play
          </Button>
        </Collapse>
        <Collapse in={step >= 0} timeout={'auto'}>
          {this.renderStep()}
          <MobileStepper
            activeStep={step}
            className={styles.Stepper}
            position="static"
            steps={steps.length}
            variant="dots"
            backButton={
              <Button
                name="Instructions Back Button"
                onClick={() => this.previousStep()}
                size="small"
              >
                <KeyboardArrowLeft/>
                Back
              </Button>
            }
            nextButton={
              <Button
                name="Instructions Next Button"
                onClick={() => this.nextStep()}
                size="small"
              >
                {step === steps.length - 1 ? 'Done' : 'Next'}
                <KeyboardArrowRight/>
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