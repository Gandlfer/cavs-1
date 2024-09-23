
#Download singularity
WS=(~)
sudo apt-get update && \
sudo apt-get install -y build-essential \
    libseccomp-dev pkg-config squashfs-tools cryptsetup git curl python-pip

sudo rm -r /usr/local/go

export VERSION=1.20.4 OS=linux ARCH=amd64  # change this as you need

wget -O /tmp/go${VERSION}.${OS}-${ARCH}.tar.gz https://dl.google.com/go/go${VERSION}.${OS}-${ARCH}.tar.gz && \
sudo tar -C /usr/local -xzf /tmp/go${VERSION}.${OS}-${ARCH}.tar.gz

echo 'export GOPATH=${HOME}/go' >> ~/.bashrc && \
echo 'export PATH=/usr/local/go/bin:${PATH}:${GOPATH}/bin' >> ~/.bashrc && \
source ~/.bashrc

curl -sfL https://install.goreleaser.com/github.com/golangci/golangci-lint.sh |
sh -s -- -b $(go env GOPATH)/bin v1.21.0

mkdir -p ${GOPATH}/src/github.com/sylabs && \
cd ${GOPATH}/src/github.com/sylabs && \
git clone https://github.com/sylabs/singularity.git && \
cd singularity

git checkout v3.11.3

cd ${GOPATH}/src/github.com/sylabs/singularity && \
./mconfig && \
cd ./builddir && \
make && \
sudo make install

singularity version

# Create a catkin workspace
mkdir ~/catkin_ws
CWS=~/catkin_ws
mkdir ${CWS}/src

cd $CWS/src

# Git Clone Nature Stack, mavs_ros, rosbridge-suite rosauth
git clone https://github.com/CGoodin/mavs_ros # mavs_ros

git clone https://github.com/CGoodin/nature-stack.git nature # nature
cd $CWS/src/nature
cp CMakeLists_ros1.cmake CMakeLists.txt
cp package_ros1.xml package.xml

cd $CWS/src
git clone https://github.com/GT-RAIL/rosauth.git # rosauth
pip install tornado future pymongo

