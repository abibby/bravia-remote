package simpleip

import "fmt"

const (
	SetPowerStatusOn  = "*SCPOWR0000000000000001\n"
	SetPowerStatusOff = "*SCPOWR0000000000000000\n"
	GetPowerStatus    = "*SEPOWR################\n"
	TogglePowerStatus = "*SEPOWR################\n"
	GetAudioVolume    = "*SEVOLU################\n"
	SetAudioMuteOn    = "*SCAMUT0000000000000001\n"
	SetAudioMuteOff   = "*SCAMUT0000000000000000\n"
	GetAudioMute      = "*SEAMUT################\n"
	ScreenOff         = "*SCPMUT0000000000000001\n"
	ScreenOn          = "*SCPMUT0000000000000000\n"
)

func SetIrccCode(code uint) string {
	return fmt.Sprintf("*SCIRCC%016d\n", code)
}

func SetAudioVolume(volume int) string {
	return fmt.Sprintf("*SCVOLU%016d\n", volume)
}

type InputType uint8

const (
	InputTypeHDMI           = InputType(1)
	InputTypeComposite      = InputType(3)
	InputTypeComponent      = InputType(4)
	InputTypeScreeMirroring = InputType(5)
)

func SetInput(inputType uint8, input int) string {
	return fmt.Sprintf("*SCINPT0000000%d0000%04d\n", inputType, input)
}
