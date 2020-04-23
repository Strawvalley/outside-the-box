import { SoundEffect, Params } from './audio-libs/jsfxr';
import { logWarning } from './client_log_manager';
import { UpdateTrigger } from '../../shared';
import { Subject } from 'rxjs';

const audioManager = {
  muted: false,
  playSound(json: string): void {
    try {
      if (!this.muted) {
        const params = new Params().fromJSON(JSON.parse(json));
        const sound = new SoundEffect(params).generate();
        sound.getAudio().play();
      }
    } catch (err) {
      logWarning(`Audio manager error playing sound: ${err}`);
    }
  },
  playSoundByUpdateTrigger(username: string, updateTrigger: UpdateTrigger, updateTriggeredBy?: string): void {
    switch (updateTrigger) {
      case UpdateTrigger.USER_JOINED_ROOM:
        if (updateTriggeredBy !== username) audioManager.playJoinGame();
        return;
      case UpdateTrigger.USER_LEFT_ROOM:
        audioManager.playUserLeft();
        return;
      case UpdateTrigger.INITIATED_NEW_ROUND:
        audioManager.playInitiatedNewRound();
        return;
      case UpdateTrigger.TIME_RAN_OUT:
        audioManager.playTimeRanOut();
        return;
      case UpdateTrigger.USER_SELECTED_WORD:
        audioManager.playSelectedWord();
        return;
      case UpdateTrigger.USER_SUBMITTED_WORD:
        audioManager.playSubmittedWord();
        return;
      case UpdateTrigger.ALL_USERS_SUBMITTED_WORD:
        audioManager.playAllUsersSubmittedWord();
        return;
      case UpdateTrigger.USER_SUBMITTED_GUESS:
        audioManager.playZonk();
        return;
      case UpdateTrigger.USER_GUESSED_WORD:
        audioManager.playSuccess();
        return;
      case UpdateTrigger.USER_USED_ALL_GUESSES:
        audioManager.playBigZonk();
        return;
      case UpdateTrigger.PAUSED_GAME:
        audioManager.playPause();
        return;
      case UpdateTrigger.UNPAUSED_GAME:
        audioManager.playUnpause();
        return;
      case UpdateTrigger.FINISHED_GAME:
        audioManager.playFinishedGame();
        return;
    }
  },
  playJoinGame(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.012562715178696915,
        "p_env_punch": 0.506751936167325,
        "p_env_decay": 0.3864075049088964,
        "p_base_freq": 0.497,
        "p_freq_limit": 0,
        "p_freq_ramp": 0,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0.5358623116625494,
        "p_arp_speed": 0.5429207154730031,
        "p_duty": 0.268,
        "p_duty_ramp": 0.131,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0.018,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playSuccess(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.012562715178696915,
        "p_env_punch": 0.506751936167325,
        "p_env_decay": 0.3864075049088964,
        "p_base_freq": 0.497,
        "p_freq_limit": 0,
        "p_freq_ramp": 0,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0.5358623116625494,
        "p_arp_speed": 0.5429207154730031,
        "p_duty": 0.268,
        "p_duty_ramp": 0.131,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0.018,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `)
  },
  playTimeTick(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 0,
        "p_env_attack": 0,
        "p_env_sustain": 0.13268336504111422,
        "p_env_punch": 0,
        "p_env_decay": 0.033931451292959734,
        "p_base_freq": 0.3011730411823774,
        "p_freq_limit": 0,
        "p_freq_ramp": 0,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 0.17977906676570393,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0.1,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playUserLeft(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 0,
        "p_env_attack": 0,
        "p_env_sustain": 0.16687689946436313,
        "p_env_punch": 0.18298564093855976,
        "p_env_decay": 0.10376494838909389,
        "p_base_freq": 0.8536565671211456,
        "p_freq_limit": 0.0057615038890078685,
        "p_freq_ramp": -0.41700236289686077,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 0.27060421262808787,
        "p_duty_ramp": 0.13062176233919667,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0.04392170318522728,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playZonk(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 0,
        "p_env_attack": 0,
        "p_env_sustain": 0.16687689946436313,
        "p_env_punch": 0.18298564093855976,
        "p_env_decay": 0.10376494838909389,
        "p_base_freq": 0.8536565671211456,
        "p_freq_limit": 0.0057615038890078685,
        "p_freq_ramp": -0.41700236289686077,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 0.27060421262808787,
        "p_duty_ramp": 0.13062176233919667,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0.04392170318522728,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playBigZonk(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 3,
        "p_env_attack": 0,
        "p_env_sustain": 0.36774895592233636,
        "p_env_punch": 0.5563742640025319,
        "p_env_decay": 0.4777068218074103,
        "p_base_freq": 0.015412806232324668,
        "p_freq_limit": 0,
        "p_freq_ramp": 0,
        "p_freq_dramp": 0,
        "p_vib_strength": 0.5522274024637877,
        "p_vib_speed": 0.3960366396031035,
        "p_arp_mod": 0.5884916368538538,
        "p_arp_speed": 0.8826743064422657,
        "p_duty": 0,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0.5972489828102197,
        "p_pha_ramp": -0.057468560639640495,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playInitiatedNewRound(): void {
    this.playSound(`
    {
      "oldParams": true,
      "wave_type": 1,
      "p_env_attack": 0,
      "p_env_sustain": 0.08678548997451606,
      "p_env_punch": 0,
      "p_env_decay": 0.33388142100429646,
      "p_base_freq": 0.25740603496465764,
      "p_freq_limit": 0,
      "p_freq_ramp": 0.21551638981388815,
      "p_freq_dramp": 0,
      "p_vib_strength": 0,
      "p_vib_speed": 0,
      "p_arp_mod": 0,
      "p_arp_speed": 0,
      "p_duty": 1,
      "p_duty_ramp": 0,
      "p_repeat_speed": 0,
      "p_pha_offset": 0,
      "p_pha_ramp": 0,
      "p_lpf_freq": 1,
      "p_lpf_ramp": 0,
      "p_lpf_resonance": 0,
      "p_hpf_freq": 0,
      "p_hpf_ramp": 0,
      "sound_vol": 0.25,
      "sample_rate": 44100,
      "sample_size": 8
    }
  `);
  },
  playUnpause(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.08678548997451606,
        "p_env_punch": 0,
        "p_env_decay": 0.33388142100429646,
        "p_base_freq": 0.25740603496465764,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21551638981388815,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 1,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playPause(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.08678548997451606,
        "p_env_punch": 0,
        "p_env_decay": 0.33388142100429646,
        "p_base_freq": 0.25740603496465764,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21551638981388815,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 1,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playTimeRanOut(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.08678548997451606,
        "p_env_punch": 0,
        "p_env_decay": 0.33388142100429646,
        "p_base_freq": 0.25740603496465764,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21551638981388815,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 1,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playSelectedWord(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.08678548997451606,
        "p_env_punch": 0,
        "p_env_decay": 0.33388142100429646,
        "p_base_freq": 0.25740603496465764,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21551638981388815,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 1,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playSubmittedWord(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.08678548997451606,
        "p_env_punch": 0,
        "p_env_decay": 0.33388142100429646,
        "p_base_freq": 0.25740603496465764,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21551638981388815,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 1,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playAllUsersSubmittedWord(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.08678548997451606,
        "p_env_punch": 0,
        "p_env_decay": 0.33388142100429646,
        "p_base_freq": 0.25740603496465764,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21551638981388815,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 1,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playFinishedGame(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 1,
        "p_env_attack": 0,
        "p_env_sustain": 0.08678548997451606,
        "p_env_punch": 0,
        "p_env_decay": 0.33388142100429646,
        "p_base_freq": 0.25740603496465764,
        "p_freq_limit": 0,
        "p_freq_ramp": 0.21551638981388815,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 1,
        "p_duty_ramp": 0,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
  playForbidden(): void {
    this.playSound(`
      {
        "oldParams": true,
        "wave_type": 0,
        "p_env_attack": 0,
        "p_env_sustain": 0.16687689946436313,
        "p_env_punch": 0.18298564093855976,
        "p_env_decay": 0.10376494838909389,
        "p_base_freq": 0.8536565671211456,
        "p_freq_limit": 0.0057615038890078685,
        "p_freq_ramp": -0.41700236289686077,
        "p_freq_dramp": 0,
        "p_vib_strength": 0,
        "p_vib_speed": 0,
        "p_arp_mod": 0,
        "p_arp_speed": 0,
        "p_duty": 0.27060421262808787,
        "p_duty_ramp": 0.13062176233919667,
        "p_repeat_speed": 0,
        "p_pha_offset": 0,
        "p_pha_ramp": 0,
        "p_lpf_freq": 1,
        "p_lpf_ramp": 0,
        "p_lpf_resonance": 0,
        "p_hpf_freq": 0.04392170318522728,
        "p_hpf_ramp": 0,
        "sound_vol": 0.25,
        "sample_rate": 44100,
        "sample_size": 8
      }
    `);
  },
}

export const muteState$: Subject<boolean> = new Subject<boolean>();

muteState$.subscribe((muted) => audioManager.muted = muted);

export default audioManager
