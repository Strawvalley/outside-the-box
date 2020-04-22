import { SoundEffect, Params } from './audio-libs/jsfxr';

export function playSound(json: string): void {
  const params = new Params().fromJSON(JSON.parse(json));
  const sound = new SoundEffect(params).generate();
  sound.getAudio().play();
}

export function playSuccess(): void {
  playSound(`
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
}