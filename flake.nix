# docodego — the intent-and-evidence layer for the agent age
#
# Runs the released binary directly: `nix run github:DoCoDeGo/docodego-alpha`
# or add the flake and `nix install docodego`.
# Pins v0.7.1; the version and sha256s below are the release's own
# sha256sums.txt entries — bump them together at each release.
{
  description = "docodego — the intent-and-evidence layer for the agent age";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
    let
      version = "0.7.1";
      assets = {
        "x86_64-linux" = {
          asset = "docodego-linux-x64";
          sha256 = "9f3794d1b03e4a54c066e8737b01deb3dcd8c89dc6800ef62ea8de325326460a";
        };
        "aarch64-linux" = {
          asset = "docodego-linux-arm64";
          sha256 = "7f4ce2324f8f974c9110c1b131a98060d8e41aa063bd67040067c415c133be45";
        };
        "x86_64-darwin" = {
          asset = "docodego-darwin-x64";
          sha256 = "713319b1be79da605a18e2ad42ec9fd2d8257df5b86c18375163a19063afb63a";
        };
        "aarch64-darwin" = {
          asset = "docodego-darwin-arm64";
          sha256 = "1b51a1e14b5babc016d922b5dd6de51a1ce0e0d5fd42472aaec9015715e92e3f";
        };
      };
    in
    {
      packages = builtins.mapAttrs
        (system: a:
          let
            pkgs = nixpkgs.legacyPackages.${system};
          in
          pkgs.stdenv.mkDerivation {
            pname = "docodego";
            inherit version;
            src = pkgs.fetchurl {
              url = "https://github.com/DoCoDeGo/docodego-alpha/releases/download/v${version}/${a.asset}";
              inherit (a) sha256;
            };
            dontUnpack = true;
            dontBuild = true;
            dontConfigure = true;
            installPhase = ''
              mkdir -p $out/bin
              cp $src $out/bin/docodego
              chmod +x $out/bin/docodego
            '';
            meta = {
              description = "The intent-and-evidence layer for the agent age";
              homepage = "https://docodego.com";
              license = pkgs.lib.licenses.mit;
              platforms = builtins.attrNames assets;
              mainProgram = "docodego";
            };
          })
        assets;
    };
}
